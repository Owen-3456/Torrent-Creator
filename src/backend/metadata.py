"""Video file metadata extraction using ffprobe."""

import os
import json
import subprocess


def get_file_metadata(filepath: str) -> dict:
    """Extract metadata from video file using ffprobe."""
    metadata = {
        "resolution": "",
        "video_codec": "",
        "audio_codec": "",
        "file_size": "",
        "duration": "",
        "bit_depth": "",
        "hdr_format": "",
        "audio_channels": ""
    }

    # Get file size
    try:
        file_size_bytes = os.path.getsize(filepath)
        # Convert to human-readable format
        if file_size_bytes >= 1024**3:  # GB
            metadata["file_size"] = f"{file_size_bytes / (1024**3):.2f} GB"
        elif file_size_bytes >= 1024**2:  # MB
            metadata["file_size"] = f"{file_size_bytes / (1024**2):.2f} MB"
        else:
            metadata["file_size"] = f"{file_size_bytes / 1024:.2f} KB"
    except Exception as e:
        print(f"Error getting file size: {e}")

    # Try to use ffprobe
    try:
        # Check if ffprobe is available
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", filepath],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            data = json.loads(result.stdout)

            # Extract video stream info
            video_stream = None
            audio_stream = None

            for stream in data.get("streams", []):
                if stream.get("codec_type") == "video" and not video_stream:
                    video_stream = stream
                elif stream.get("codec_type") == "audio" and not audio_stream:
                    audio_stream = stream

            if video_stream:
                # Resolution — use coded dimensions as fallback since some
                # containers report cropped height (e.g. letterboxed 1080p
                # content with height < 1080).  Checking width disambiguates
                # these cases: a true 1080p encode has width >= 1920 even when
                # the stored height is reduced by letterboxing.
                width = video_stream.get("coded_width") or video_stream.get("width")
                height = video_stream.get("coded_height") or video_stream.get("height")
                if width and height:
                    # Use the larger of width- and height-derived resolution so
                    # that letterboxed or pillarboxed content is classified by
                    # its actual encode tier rather than the visible rectangle.
                    res_by_height = height
                    res_by_width = round(width * 9 / 16)  # assume 16:9 reference

                    effective = max(res_by_height, res_by_width)

                    if effective >= 2160:
                        metadata["resolution"] = "2160p"
                    elif effective >= 1440:
                        metadata["resolution"] = "1440p"
                    elif effective >= 1080:
                        metadata["resolution"] = "1080p"
                    elif effective >= 720:
                        metadata["resolution"] = "720p"
                    elif effective >= 576:
                        metadata["resolution"] = "576p"
                    elif effective >= 480:
                        metadata["resolution"] = "480p"
                    else:
                        metadata["resolution"] = f"{effective}p"

                # Video codec
                codec_name = video_stream.get("codec_name", "")
                if codec_name == "h264":
                    metadata["video_codec"] = "x264"
                elif codec_name == "hevc":
                    metadata["video_codec"] = "x265"
                elif codec_name == "av1":
                    metadata["video_codec"] = "AV1"
                elif codec_name == "vp9":
                    metadata["video_codec"] = "VP9"
                else:
                    metadata["video_codec"] = codec_name.upper()

                # Bit depth
                pix_fmt = video_stream.get("pix_fmt", "")
                if "10le" in pix_fmt or "10be" in pix_fmt:
                    metadata["bit_depth"] = "10-bit"
                elif "12le" in pix_fmt or "12be" in pix_fmt:
                    metadata["bit_depth"] = "12-bit"
                else:
                    metadata["bit_depth"] = "8-bit"

                # HDR format (check color transfer and color space)
                color_transfer = video_stream.get("color_transfer", "")
                color_space = video_stream.get("color_space", "")

                if "smpte2084" in color_transfer.lower():
                    metadata["hdr_format"] = "HDR10"
                elif "arib-std-b67" in color_transfer.lower():
                    metadata["hdr_format"] = "HLG"
                elif "bt2020" in color_space.lower() and metadata["bit_depth"] == "10-bit":
                    metadata["hdr_format"] = "HDR"

            if audio_stream:
                # Audio codec
                codec_name = audio_stream.get("codec_name", "")
                if codec_name == "aac":
                    metadata["audio_codec"] = "AAC"
                elif codec_name == "ac3":
                    metadata["audio_codec"] = "AC3"
                elif codec_name == "eac3":
                    metadata["audio_codec"] = "EAC3"
                elif codec_name == "dts":
                    metadata["audio_codec"] = "DTS"
                elif codec_name == "truehd":
                    metadata["audio_codec"] = "TrueHD"
                elif codec_name == "flac":
                    metadata["audio_codec"] = "FLAC"
                elif codec_name == "opus":
                    metadata["audio_codec"] = "Opus"
                elif codec_name == "vorbis":
                    metadata["audio_codec"] = "Vorbis"
                else:
                    metadata["audio_codec"] = codec_name.upper()

                # Audio channels
                channels = audio_stream.get("channels")
                if channels:
                    if channels == 1:
                        metadata["audio_channels"] = "1.0"
                    elif channels == 2:
                        metadata["audio_channels"] = "2.0"
                    elif channels == 6:
                        metadata["audio_channels"] = "5.1"
                    elif channels == 8:
                        metadata["audio_channels"] = "7.1"
                    else:
                        metadata["audio_channels"] = f"{channels}.0"

            # Duration
            format_data = data.get("format", {})
            duration_seconds = format_data.get("duration")
            if duration_seconds:
                try:
                    total_seconds = int(float(duration_seconds))
                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60
                    metadata["duration"] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                except (ValueError, TypeError):
                    pass

    except FileNotFoundError:
        print("ffprobe not found - metadata extraction unavailable")
    except subprocess.TimeoutExpired:
        print("ffprobe timed out")
    except Exception as e:
        print(f"Error running ffprobe: {e}")

    return metadata
