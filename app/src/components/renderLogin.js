import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
// import Col from 'react-bootstrap/Col'; 
// import Row from 'react-bootstrap/Row'; 
// import Container from 'react-bootstrap/Container';

function renderLogin() {
  return (

    <Form>

      <Form.Group className="mb-3" controlId="renderLogin.userCredentials">

        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" />

        <Form.Label>Password</Form.Label>
        <Form.Control type="password" />

      </Form.Group>

      <Form.Group className="mb-3" controlId="renderLogin.loginButton">

        <Button 
          variant="primary" 
          type="button" 
          // onClick={functionHere()} 
        >
          Login
        </Button> 
        
      </Form.Group>

    </Form>

  );
}

export default renderLogin;



