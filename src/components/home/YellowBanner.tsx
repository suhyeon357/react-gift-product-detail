/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const Banner = styled.div`
  width: 100%;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
`;

const Text1 = styled.div`
  font-size: ${({ theme }) =>
    theme.typography.label2Regular.fontSize};
  font-weight: ${({ theme }) =>
    theme.typography.label2Regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray600};
  padding: 0px 0px 6px 16px;
`;

const Text2 = styled.div`
  font-size: ${({ theme }) => theme.typography.label1Bold.fontSize};
  font-weight: ${({ theme }) =>
    theme.typography.label1Bold.fontWeight};
  color: ${({ theme }) => theme.colors.gray1000};
  padding-left: 16px;
`;

export const YellowBanner = () => {
  return (
    <>
      <Banner>
        <Text1>카카오테크 캠퍼스 3기 여러분</Text1>
        <Text2>프론트엔드 2단계 과제 화이팅! 🎉</Text2>
      </Banner>
    </>
  );
};
