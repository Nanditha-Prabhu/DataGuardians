# Police Data Hub

Police Data Hub is a secure platform designed to manage police data efficiently and securely. It integrates advanced security measures and modern technologies to ensure the confidentiality, integrity, and transparency of police data handling.

https://github.com/satwikkamath/DataGuardians/assets/107809929/7bcaeb53-62dd-4f11-a434-b1443d93ef1e

## Key Features

### Secure Authentication

Police Data Hub employs Firebase authentication to ensure secure login. Users can access the platform using their unique credentials, enhancing overall security and access control.

### Blockchain Integration

To maintain a transparent and immutable record of file access, Police Data Hub integrates blockchain technology. Every user action, including file uploads, access, and anonymization requests, is securely recorded on the blockchain, ensuring accountability and preventing unauthorized modifications.

### Upload Data

The platform enables users to upload CSV files containing police data. Upon upload, the data is securely stored in a MongoDB database, ensuring efficient data management and retrieval.

### Anonymization of Data

In the "Access Data" section, users can select specific files and choose columns to anonymize. The platform leverages the Presidio Anonymizer to anonymize the selected columns, protecting sensitive information while maintaining data utility.

### Blockchain Tracking

Police Data Hub tracks crucial information related to user activities using blockchain technology. Each user action, including file access and anonymization requests, is recorded on the blockchain along with relevant details such as username, timestamp, file name, and accessed column. This ensures transparency, auditability, and tamper-proof record-keeping.
