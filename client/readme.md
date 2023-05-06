# Protecting Routes

    we will create an endpoint in the backend that gives us the currently logged in user.
    Based on the JWT token
    if the token is valid {not expired and issued by our backend}
    Only then we will be able to get that user from database and send successfull response.
    So if we get successfull response ,that means that user is authenticated and has rights to access protected page.
