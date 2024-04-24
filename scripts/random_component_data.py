import json
import numpy as np

# Generate smooth random acceleration data
def generate_acceleration_data(num_frames):
    x = np.linspace(0, 10, num_frames)
    y = np.sin(x) + np.random.normal(scale=0.2, size=num_frames)
    return y

# Generate time series data
def generate_time_series_data(num_frames):
    acceleration_data = generate_acceleration_data(num_frames)
    time_series_data = [{"frame": i, "acceleration": acceleration_data[i]} for i in range(num_frames)]
    return time_series_data

# Main function to generate and save JSON data
def main():
    num_frames = 1000
    time_series_data = generate_time_series_data(num_frames)
    with open('time_series_data.json', 'w') as outfile:
        json.dump({"time_series_data": time_series_data}, outfile, indent=4)

if __name__ == "__main__":
    main()