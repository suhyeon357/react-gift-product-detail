/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInputWithValidation } from '../hooks/useInputValidation';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.borderDefault};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.title2Bold};
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 26.25rem;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputStyle = styled.input`
  width: 100%;
  padding: 12px 0;
  margin-bottom: 24px;

  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 16px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    border-bottom: 2px solid #333;
  }
`;

const ErrorText = styled.p`
  width: 100%;
  margin-bottom: 16px;
  font-size: 0.8rem;
  color: red;
  text-align: left;
`;

const LoginButton = styled.button<{ disabled: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.yellow300 : theme.colors.kakaoYellow};

  font-size: ${({ theme }) => theme.typography.body2Regular.fontSize};
  font-weight: ${({ theme }) =>
    theme.typography.body2Regular.fontWeight};
  line-height: ${({ theme }) =>
    theme.typography.body2Regular.lineHeight};
  width: 100%;
  height: 2.75rem;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray900};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const validateEmail = (value: string) => {
  if (!value.trim()) return 'ID는 반드시 입력되어야 합니다.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value)
    ? ''
    : 'ID는 이메일 형식이어야 합니다.';
};

const validatePassword = (value: string) => {
  if (!value.trim()) return 'PW는 반드시 입력되어야 합니다.';
  if (value.length < 8) return 'PW는 최소 8글자 이상이어야 합니다.';

  return '';
};

const userInfoStorage = {
  set: (data: { authToken: string; email: string; name: string }) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  },
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const emailInput = useInputWithValidation('', validateEmail);
  const passwordInput = useInputWithValidation('', validatePassword);
  const isFormValid = emailInput.isValid && passwordInput.isValid;

  if (isAuthenticated) {
    navigate('/my', { replace: true });
    return null;
  }

  const handleLogin = async () => {
    if (!isFormValid) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/login',
        {
          email: emailInput.value,
          password: passwordInput.value,
        }
      );

      console.log('로그인 응답:', response.data);

      const { authToken, email, name } = response.data.data;

      login({ email, name, authToken });

      userInfoStorage.set({ authToken, email, name });

      const redirectPath = location.state?.from?.pathname;
      navigate(redirectPath || '/my', { replace: true });
    } catch (error: any) {
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500
      ) {
        toast.error(error.response.data?.message || '로그인 실패');
      } else {
        toast.error('서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <PageWrapper>
      <HeaderContainer>
        <FiArrowLeft size={20} onClick={() => navigate('/')} />
        <Title>선물하기</Title>
        <FiUser size={20} />
      </HeaderContainer>

      <MainContent>
        <LoginContainer>
          <img
            alt="카카오 로고"
            src="./kakao_logo.svg"
            width="88px"
            height="88px"
          />
          <br />
          <InputStyle
            type="text"
            placeholder="이메일"
            value={emailInput.value}
            onChange={e => emailInput.setValue(e.target.value)}
            onBlur={emailInput.handleBlur}
          />
          {emailInput.error && (
            <ErrorText>{emailInput.error}</ErrorText>
          )}

          <InputStyle
            type="password"
            placeholder="비밀번호"
            value={passwordInput.value}
            onChange={e => passwordInput.setValue(e.target.value)}
            onBlur={passwordInput.handleBlur}
          />
          {passwordInput.error && (
            <ErrorText>{passwordInput.error}</ErrorText>
          )}

          <LoginButton disabled={!isFormValid} onClick={handleLogin}>
            로그인
          </LoginButton>
        </LoginContainer>
      </MainContent>
    </PageWrapper>
  );
};

export default Login;
