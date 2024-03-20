import streamlit as sr


def login():
    sr.title("Welcome to Police-Data-Hub!")
    login, create_account = sr.tabs(["Log In", "Create an Account"])

    with login:
        sr.write("### Login to your existing account")
        emailid_login = sr.text_input("Enter your email ID", key="emailid_login")
        role_login = sr.selectbox("Select your role",["Role 1", "Role 2", "Role 3"], key="role_login")
        pswd_login = sr.text_input("Enter your password", type='password', key="pswd_login")
        sr.button("Log In")

    with create_account:
        sr.write("### Create an account")
        username_create = sr.text_input("Enter your unique username", key="username_create")
        emailid_create = sr.text_input("Enter your email ID", key="emailid_create")
        role_create = sr.selectbox("Select your role",["Role 1", "Role 2", "Role 3"], key="role_create")
        pswd_create = sr.text_input("Enter your password", type='password', key="pswd_create")
        if sr.button("Create"):
            sr.success("Account Created!!")
            sr.markdown("Please login using email ID and password.")
        else:
            sr.error("Something went wrong.")

login()

