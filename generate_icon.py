
import matplotlib.pyplot as plt
from matplotlib.path import Path
import matplotlib.patches as patches

# Constants
OUTPUT_FILE = r"assets\images\custom-notification-icon.png"
IMG_SIZE = 1024
SVG_VIEWBOX_SIZE = 24

# Create figure
# 1024x1024 pixels. 100 DPI -> 10.24 inches.
fig = plt.figure(figsize=(IMG_SIZE/100, IMG_SIZE/100), dpi=100)
# Add axes covering the whole figure
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, SVG_VIEWBOX_SIZE)
ax.set_ylim(SVG_VIEWBOX_SIZE, 0) # Invert Y axis to match SVG coordinates
ax.axis('off')

# Define Path 1: Bell Body
# M18 8 A6 6 0 0 0 6 8 c0 7-3 9-3 9 h18 s-3-2-3-9
# Segments logic derived in planning
verts_body = [(18, 8)]
codes_body = [Path.MOVETO]

# 1. Semicircle (18,8) -> (6,8) via (12, 2)
# Using k for quarter circle approximation approx 0.55228...
k_factor = 0.55228475
r = 6
k = r * k_factor

# Segment 1 (18,8) -> (12,2)
verts_body.extend([
    (18, 8 - k),      # cp1
    (12 + k, 2),      # cp2
    (12, 2)           # end
])
codes_body.extend([Path.CURVE4] * 3)

# Segment 2 (12,2) -> (6,8)
verts_body.extend([
    (12 - k, 2),      # cp1
    (6, 8 - k),       # cp2
    (6, 8)            # end
])
codes_body.extend([Path.CURVE4] * 3)

# 2. Flare Left: c 0 7 -3 9 -3 9
# Relative cubic bezier from (6,8)
verts_body.extend([
    (6, 15),          # cp1 (6+0, 8+7)
    (3, 17),          # cp2 (6-3, 8+9)
    (3, 17)           # end (6-3, 8+9)
])
codes_body.extend([Path.CURVE4] * 3)

# 3. Bottom Line: h18
verts_body.append((21, 17))
codes_body.append(Path.LINETO)

# 4. Flare Right: s -3 -2 -3 -9
# Smooth bezier from (21,17). CP1 is reflection of previous CP2 (3,17) ?
# No, previous CP2 was (3,17) relative to (6,8)? No.
# Previous segment was LINETO. So CP1 = Current = (21,17).
# Relative: s dx2 dy2 dx dy.
# CP1 = (21, 17)
# CP2 = (21-3, 17-2) = (18, 15)
# End = (21-3, 17-9) = (18, 8)
verts_body.extend([
    (21, 17),         # cp1
    (18, 15),         # cp2
    (18, 8)           # end
])
codes_body.extend([Path.CURVE4] * 3)

# Close
verts_body.append((0,0)) # Ignored
codes_body.append(Path.CLOSEPOLY)


# Define Path 2: Clapper
# M13.73 21 a2 2 0 0 1 -3.46 0
verts_clapper = [(13.73, 21)]
codes_clapper = [Path.MOVETO]

# Arc approximation (Calculated in planning)
# Segment 1 (13.73, 21) -> (12, 22)
verts_clapper.extend([
    (13.37, 21.62),   # cp1
    (12.71, 22),      # cp2
    (12, 22)          # end
])
codes_clapper.extend([Path.CURVE4] * 3)

# Segment 2 (12, 22) -> (10.27, 21)
verts_clapper.extend([
    (11.29, 22),      # cp1
    (10.63, 21.62),   # cp2
    (10.27, 21)       # end
])
codes_clapper.extend([Path.CURVE4] * 3)

# Close (to fill)
verts_clapper.append((0,0))
codes_clapper.append(Path.CLOSEPOLY)

# Create Patches
path_body = Path(verts_body, codes_body)
patch_body = patches.PathPatch(path_body, facecolor='white', edgecolor='none', lw=0)

path_clapper = Path(verts_clapper, codes_clapper)
patch_clapper = patches.PathPatch(path_clapper, facecolor='white', edgecolor='none', lw=0)

ax.add_patch(patch_body)
ax.add_patch(patch_clapper)

# Save
# transparent=True
plt.savefig(OUTPUT_FILE, transparent=True)
print(f"Generated {OUTPUT_FILE}")
