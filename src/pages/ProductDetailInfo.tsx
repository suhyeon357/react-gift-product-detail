import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import styled from '@emotion/styled';

const BottomOrderButton = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  text-align: center;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDefault};

  cursor: pointer;
`;

const ProductDetailInfo = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const id = Number(productId);

  console.log(id);
  const moveToOrder = () => {
    navigate(`/order/${id}`);
  };

  return (
    <>
      <Header />
      <div>상품 상세정보 페이지</div>
      <BottomOrderButton onClick={() => moveToOrder()}>
        주문하기
      </BottomOrderButton>
    </>
  );
};

export default ProductDetailInfo;
