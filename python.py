import pandas as pd

# Load both files
tows = pd.read_csv("data/towed_vehicles.csv")
coords = pd.read_csv("data/IL_lat_lon.csv")

# Strip and standardize address format
tows["Towed to Address Lower"] = tows["Towed to Address"].str.strip().str.lower()
coords["Towed to Address Lower"] = coords["Towed to Address Lower"].str.strip().str.lower()

# Merge by address
merged = pd.merge(tows, coords, on="Towed to Address Lower", how="inner")

# Group by location and color to count tows
grouped = merged.groupby(["Towed to Address Lower", "Latitude", "Longitude", "Color"]).size().reset_index(name="Count")

# Save new spatial + color file
grouped.to_csv("IL_lat_lon_color.csv", index=False)
