import streamlit as sr

def app():
    sr.title("Welcome to Police-Data-Forum!")
    create_account, login = sr.tabs(["Create an Account", "Log In"])

    with create_account:
        sr.subheader("Create an account")
        username_create = sr.text_input("Enter your unique username", key="username_create")
        emailid_create = sr.text_input("Enter your email ID", key="emailid_create")
        pswd_create = sr.text_input("Enter your password", type='password', key="pswd_create")
        sr.button("Create")

    with login:
        sr.subheader("Login to your existing account")
        emailid_login = sr.text_input("Enter your email ID", key="emailid_login")
        pswd_login = sr.text_input("Enter your password", type='password', key="pswd_login")
        sr.button("Log In")

app()
