import streamlit as st

def access_data():
    st.write("### Do you want to access the data?")
    with st.form("access_data_form"):
        file_name = st.selectbox('Which file do you want to access?', ["Traffic data", "Accused data", "Rowdy sheet", "Victim data"])
        data_tobe_anonymized = st.multiselect('Select all the attributes that must be anonymized', ['Name', 'Age', 'Address', 'Case', 'FIR details'])

        access_data_submit = st.form_submit_button("Submit")

access_data()