import streamlit as st
import requests

def access_data():
    # data_files = requests.get("http://localhost:5000/list-objects")
    if 'user_info' not in st.session_state:
        st.write("### Do you want to access the data?")
        with st.form("access_data_form"):
            # for i in data_files:
            #     st.write(data_files.content)
            file_name = st.selectbox('Which file do you want to access?', ["Traffic data", "Accused data", "Rowdy sheet", "Victim data"])
            data_tobe_anonymized = st.multiselect('Select all the attributes that must be anonymized', ['Name', 'Age', 'Address', 'Case', 'FIR details'])

            access_data_submit = st.form_submit_button("Submit")
    else:
        st.sidebar.write("User logged in.")
        st.write("### Do you want to access the data?")
        with st.form("access_data_form"):
            file_name = st.selectbox('Which file do you want to access?', ["Traffic data", "Accused data", "Rowdy sheet", "Victim data"])
            data_tobe_anonymized = st.multiselect('Select all the attributes that must be anonymized', ['Name', 'Age', 'Address', 'Case', 'FIR details'])

            access_data_submit = st.form_submit_button("Submit")

access_data()