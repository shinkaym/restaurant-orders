const LoginFooter: React.FC = () => {
  return (
    <div className="login-footer">
      <p>Don't have an account? <a href="/register">Register here</a></p>
      <p className="security-note"><i className="fas fa-shield-alt"></i> Secure login</p>
    </div>
  );
};

export default LoginFooter;
