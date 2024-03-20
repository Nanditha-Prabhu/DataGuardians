import streamlit as st

def privacy_regulations():
    st.write("### Compilance & Privacy Measures")
    st.write("Select your role to read the kind of control you have in ensuring the data privacy.")
    role1, role2, role3 = st.tabs(["Role 1", "Role 2", "Role 3"])
    with role1:
        st.write("- This is rule 1.")
        st.write("- This is rule 2.")
        st.write("- This is rule 3.")
    with role2:
        st.write("- This is rule 2.")
        st.write("- This is rule 1.")
        st.write("- This is rule 3.")
    with role3:
        st.write("- This is rule 1.")
        st.write("- This is rule 3.")
        st.write("- This is rule 2.")

privacy_regulations()