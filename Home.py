import streamlit as st



# https://github.com/Ashwani132003/pondering

def home():
    if 'user_info' not in st.session_state:
        st.title("Welcome to Police-Data-Hub!")
        st.write("### Previous logins")
    else:
        st.sidebar.write("User logged in.")

home()

