/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';

const FriendBox = styled.div`
  background-color: ${({ theme }) => theme.colors.gray00};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.body2Bold.fontSize};
  font-weight: ${({ theme }) =>
    theme.typography.body2Bold.fontWeight};
`;

const AddButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.kakaoYellow};

  border: none;
  border-radius: 50%;
  font-size: 20px;
`;

const Background = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: 15px;
`;

export const FriendSelect = () => {
  const { userInfo, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <Background>
          <FriendBox>
            <AddButton>+</AddButton>
            {userInfo?.name}님! 선물할 친구를 선택해 주세요.
          </FriendBox>
        </Background>
      ) : (
        <Background>
          <FriendBox>
            <AddButton>+</AddButton>
            선물할 친구를 선택해 주세요.
          </FriendBox>
        </Background>
      )}
    </div>
  );
};
