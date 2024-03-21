import streamlit as st
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import auth
# import pyrebase

# try:
#     app = firebase_admin.get_app()
# except ValueError as e:
#     cred = credentials.Certificate("dataguardians-13157-a32431f2469e.json")
#     firebase_admin.initialize_app(cred)


# def login():
#     sr.title("Welcome to Police-Data-Hub!")
#     login, create_account = sr.tabs(["Log In", "Create an Account"])

#     with login:
#         with sr.form("user_login"):
#             sr.write("### Login to your existing account")
#             emailid_login = sr.text_input("Enter your email ID", key="emailid_login")
#             role_login = sr.selectbox("Select your role",["Role 1", "Role 2", "Role 3"], key="role_login")
#             pswd_login = sr.text_input("Enter your password", type='password', key="pswd_login")
#             submit_login = sr.form_submit_button("Log In")
#             if submit_login:
#                 try:
#                     user = auth.sign_in_with_email_and_password(emailid_login, pswd_login)
#                     sr.session_state["user"] = user  # Store user information in session state
#                     sr.success("Login successful!")
#                 except Exception as e:
#                     sr.error(f"Login failed: {e}")

#     with create_account:
#         with sr.form("account_creation"):
#             sr.write("### Create an account")
#             username_create = sr.text_input("Enter your unique username", key="username_create")
#             emailid_create = sr.text_input("Enter your email ID", key="emailid_create")
#             role_create = sr.selectbox("Select your role",["Role 1", "Role 2", "Role 3"], key="role_create")
#             pswd_create = sr.text_input("Enter your password", type='password', key="pswd_create")
#             submit_create = sr.form_submit_button("Create")
#             if submit_create:
#                 user = auth.create_user(email = emailid_create, password = pswd_create, uid = username_create)
#                 sr.success("Account Created!!")
#                 sr.markdown("Please login using email ID and password.")

# login()


import auth_functions

## -------------------------------------------------------------------------------------------------
## Not logged in -----------------------------------------------------------------------------------
## -------------------------------------------------------------------------------------------------
def login():
    st.title("Welcome to Police-Data-Hub!")
    if 'user_info' not in st.session_state:

        # Authentication form layout
        do_you_have_an_account = st.selectbox(label='Do you have an account?',options=('Yes','No','I forgot my password'))
        auth_form = st.form(key='Authentication form',clear_on_submit=False)
        email = auth_form.text_input(label='Email')
        username = auth_form.text_input(label="Unique Username") if do_you_have_an_account in {'No'} else auth_form.empty()
        role = auth_form.selectbox("Select your role", ["Role-1", "Role-2", "Role-3"]) if do_you_have_an_account in {'No'} else auth_form.empty()
        password = auth_form.text_input(label='Password',type='password') if do_you_have_an_account in {'Yes','No'} else auth_form.empty()
        auth_notification = st.empty()

        # Sign In
        if do_you_have_an_account == 'Yes' and auth_form.form_submit_button(label='Sign In',use_container_width=True,type='primary'):
            with auth_notification, st.spinner('Signing in'):
                auth_functions.sign_in(email,password)

        # Create Account
        elif do_you_have_an_account == 'No' and auth_form.form_submit_button(label='Create Account',use_container_width=True,type='primary'):
            with auth_notification, st.spinner('Creating account'):
                auth_functions.create_account(email,password, username, role)

        # Password Reset
        elif do_you_have_an_account == 'I forgot my password' and auth_form.form_submit_button(label='Send Password Reset Email',use_container_width=True,type='primary'):
            with auth_notification, st.spinner('Sending password reset link'):
                auth_functions.reset_password(email)

        # Authentication success and warning messages
        if 'auth_success' in st.session_state:
            auth_notification.success(st.session_state.auth_success)
            del st.session_state.auth_success
        elif 'auth_warning' in st.session_state:
            auth_notification.warning(st.session_state.auth_warning)
            del st.session_state.auth_warning

    ## -------------------------------------------------------------------------------------------------
    ## Logged in --------------------------------------------------------------------------------------
    ## -------------------------------------------------------------------------------------------------
    else:
        
        # Show user information
        # st.header('User information:')
        # st.write(st.session_state.user_info)

        st.sidebar.write("User logged in.")

        # Sign out
        st.header('Log out')
        st.button(label='Sign Out',on_click=auth_functions.sign_out,type='primary')

        # Delete Account
        st.header('Delete account')
        password = st.text_input(label='Confirm your password',type='password')
        st.button(label='Delete Account',on_click=auth_functions.delete_account,args=[password],type='primary')

login()


# Reference: https://github.com/cmayoracurzio/streamlit_firebase_auth