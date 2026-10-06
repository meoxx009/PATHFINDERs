import math
import os
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))

# Design Palette
C_DEEP_BG = (8, 11, 13)
C_CARD_BG = (20, 25, 28)
C_CARD_BORDER = (45, 50, 54)
C_ORANGE = (255, 109, 31)
C_LINEN = (250, 243, 225)
C_COTTON = (245, 231, 198)
C_MUTED = (150, 146, 138)
C_GREEN = (184, 216, 138)
C_BLUE = (88, 166, 255)

def get_font(size):
    try:
        # Standard Windows fonts
        return ImageFont.truetype("segoeui.ttf", size)
    except Exception:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except Exception:
            return ImageFont.load_default()

def get_bold_font(size):
    try:
        return ImageFont.truetype("segoeuib.ttf", size)
    except Exception:
        try:
            return ImageFont.truetype("arialbd.ttf", size)
        except Exception:
            return ImageFont.load_default()

# -------------------------------------------------------------
# 1. GENERATE RASTER BANNER: readme-banner.png (1440 x 420)
# -------------------------------------------------------------
def generate_banner():
    width, height = 1440, 420
    im = Image.new("RGB", (width, height), C_DEEP_BG)
    draw = ImageDraw.Draw(im)

    # Ambient radial glow top-center
    for r in range(400, 0, -10):
        alpha = int(35 * (1 - r / 400.0))
        glow_color = (
            int(8 + (C_ORANGE[0] - 8) * (alpha / 255.0)),
            int(11 + (C_ORANGE[1] - 11) * (alpha / 255.0)),
            int(13 + (C_ORANGE[2] - 13) * (alpha / 255.0))
        )
        draw.ellipse([720 - r * 1.8, -r, 720 + r * 1.8, r], fill=glow_color)

    # Ambient cream glow bottom-right
    for r in range(300, 0, -15):
        alpha = int(20 * (1 - r / 300.0))
        glow_color = (
            int(8 + (C_LINEN[0] - 8) * (alpha / 255.0)),
            int(11 + (C_LINEN[1] - 11) * (alpha / 255.0)),
            int(13 + (C_LINEN[2] - 13) * (alpha / 255.0))
        )
        draw.ellipse([1250 - r, 350 - r, 1250 + r, 350 + r], fill=glow_color)

    # Accent top border
    draw.line([(100, 1), (1340, 1)], fill=C_ORANGE, width=2)

    # Badge pill
    badge_x, badge_y = 100, 50
    draw.rounded_rectangle([badge_x, badge_y, badge_x + 240, badge_y + 28], radius=14, fill=C_CARD_BG, outline=C_ORANGE, width=1)
    draw.ellipse([badge_x + 14, badge_y + 10, badge_x + 22, badge_y + 18], fill=C_ORANGE)
    font_badge = get_bold_font(11)
    draw.text((badge_x + 30, badge_y + 6), "ENGINEERING CAREER PLATFORM", font=font_badge, fill=C_LINEN)

    # Wordmark
    font_brand = get_bold_font(62)
    draw.text((100, 95), "SkillForge ", font=font_brand, fill=C_LINEN)
    bbox = draw.textbbox((100, 95), "SkillForge ", font=font_brand)
    draw.text((bbox[2], 95), "AI", font=font_brand, fill=C_ORANGE)

    # Tagline
    font_tag = get_bold_font(22)
    draw.text((102, 185), "Build the skills your next role actually needs.", font=font_tag, fill=C_COTTON)

    # Subtitle
    font_sub = get_font(14)
    draw.text((102, 222), "Resume intelligence · Skill assessment · Personalized roadmaps · Interview practice", font=font_sub, fill=C_MUTED)

    # Steps cards
    steps = [
        ("01", "Engineering Profile", "Branch & Spec"),
        ("02", "Resume Evidence", "Verbatim Code Proof"),
        ("03", "Skill Benchmarks", "5-Signal Scoring"),
        ("04", "Sprint Roadmap", "Time-Budgeted Tasks"),
        ("05", "Interview Coach", "Adaptive Path Shift")
    ]

    card_y = 280
    card_w = 210
    card_h = 80
    gap = 35

    font_step_num = get_bold_font(10)
    font_step_title = get_bold_font(13)
    font_step_sub = get_font(11)

    for i, (num, title, sub) in enumerate(steps):
        cx = 100 + i * (card_w + gap)
        is_last = (i == len(steps) - 1)
        border_col = C_ORANGE if is_last else C_CARD_BORDER
        draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=16, fill=C_CARD_BG, outline=border_col, width=1)
        draw.text((cx + 16, card_y + 12), f"STEP {num}", font=font_step_num, fill=C_ORANGE)
        draw.text((cx + 16, card_y + 32), title, font=font_step_title, fill=C_LINEN)
        draw.text((cx + 16, card_y + 52), sub, font=font_step_sub, fill=C_GREEN if is_last else C_MUTED)

        # Connector arrow
        if i < len(steps) - 1:
            ax = cx + card_w + 10
            ay = card_y + 40
            draw.line([(ax, ay), (ax + 15, ay)], fill=C_CARD_BORDER, width=2)
            draw.polygon([(ax + 15, ay - 4), (ax + 21, ay), (ax + 15, ay + 4)], fill=C_CARD_BORDER)

    banner_path = os.path.join(ASSETS_DIR, "readme-banner.png")
    im.save(banner_path, "PNG", optimize=True)
    print("Generated:", banner_path)

# -------------------------------------------------------------
# 2. GENERATE ANIMATED WORKFLOW GIF: career-journey.gif (1200 x 240)
# -------------------------------------------------------------
def generate_workflow_gif():
    width, height = 1200, 240
    steps = [
        ("1", "Engineering Profile", "Branch & Specialization", "30+ Engineering Families"),
        ("2", "Target Role", "Industry Benchmark", "Weighted Competencies"),
        ("3", "Resume Evidence", "Verbatim Excerpts", "7 Grounded States"),
        ("4", "Skill Gaps", "5-Signal Algorithm", "Transparent Scoring"),
        ("5", "Sprint Roadmap", "Time-Budgeted Tasks", "7 or 14-Day Sprints"),
        ("6", "Interview Coach", "STAR Rubric Evaluation", "⚡ Adaptive Path Shift")
    ]

    frames = []
    font_head_tag = get_bold_font(11)
    font_head_title = get_bold_font(18)
    font_num = get_bold_font(12)
    font_title = get_bold_font(13)
    font_sub = get_font(11)
    font_meta = get_bold_font(9)

    card_w = 168
    card_h = 110
    card_y = 90
    card_gap = 25
    start_x = 30

    # Create 6 frames, each highlighting one step in sequence
    for active_idx in range(len(steps)):
        im = Image.new("RGB", (width, height), C_DEEP_BG)
        draw = ImageDraw.Draw(im)

        # Top border
        draw.line([(0, 0), (width, 0)], fill=C_CARD_BORDER, width=1)

        # Header titles
        draw.text((40, 24), "SKILLFORGE AI CLOSED-LOOP ARCHITECTURE", font=font_head_tag, fill=C_ORANGE)
        draw.text((40, 44), "The Continuous Career Feedback Engine", font=font_head_title, fill=C_LINEN)

        # Draw the 6 cards
        for i, (num, title, sub, meta) in enumerate(steps):
            cx = start_x + i * (card_w + card_gap)
            is_active = (i == active_idx)

            # Card fill and border
            bg_col = (28, 34, 38) if is_active else C_CARD_BG
            border_col = C_ORANGE if is_active else C_CARD_BORDER
            border_w = 2 if is_active else 1

            draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=14, fill=bg_col, outline=border_col, width=border_w)

            # Circle badge
            badge_bg = C_ORANGE if is_active else (35, 42, 46)
            num_color = (16, 20, 22) if is_active else C_ORANGE
            draw.ellipse([cx + 14, card_y + 12, cx + 38, card_y + 36], fill=badge_bg)
            draw.text((cx + 22, card_y + 16), num, font=font_num, fill=num_color)

            # Title
            title_col = C_ORANGE if is_active else C_LINEN
            draw.text((cx + 14, card_y + 46), title, font=font_title, fill=title_col)
            draw.text((cx + 14, card_y + 66), sub, font=font_sub, fill=C_COTTON if is_active else C_MUTED)

            meta_col = C_GREEN if is_active else C_BLUE
            draw.text((cx + 14, card_y + 86), meta, font=font_meta, fill=meta_col)

            # Arrow to next step
            if i < len(steps) - 1:
                ax = cx + card_w + 5
                ay = card_y + 55
                arrow_col = C_ORANGE if is_active else (60, 68, 74)
                draw.line([(ax, ay), (ax + 10, ay)], fill=arrow_col, width=2)
                draw.polygon([(ax + 10, ay - 3), (ax + 15, ay), (ax + 10, ay + 3)], fill=arrow_col)

        frames.append(im)

    gif_path = os.path.join(ASSETS_DIR, "career-journey.gif")
    # 850ms per frame = ~5.1s total loop
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=850,
        loop=0,
        optimize=True
    )
    print("Generated:", gif_path)

if __name__ == "__main__":
    generate_banner()
    generate_workflow_gif()
