import csv

# Data for 10 entries
data = [
    ("John", "Doe", "Smith"),
    ("Jane", "Lee", "Brown"),
    ("Michael", "James", "Johnson"),
    ("Emily", "Grace", "Wilson"),
    ("David", "Alan", "Taylor"),
    ("Sarah", "Anne", "Miller"),
    ("Daniel", "Patrick", "Davis"),
    ("Olivia", "Rose", "Anderson"),
    ("William", "Robert", "Martinez"),
    ("Sophia", "Elizabeth", "Garcia")
]

# Define CSV file name
csv_file = "names.csv"

# Write data to CSV file
with open(csv_file, 'w', newline='') as file:
    writer = csv.writer(file)
    # Write header
    writer.writerow(["First Name", "Middle Name", "Last Name"])
    # Write data rows
    writer.writerows(data)

print(f"CSV file '{csv_file}' created successfully.")
