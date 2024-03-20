import streamlit as st

def upload_data():
    st.write("### Do you want to upload some more data?")
    with st.form("upload_data_form"):
        file = st.file_uploader("Choose a CSV file", accept_multiple_files=True)
        upload_data_submit = st.form_submit_button("Submit")

upload_data()