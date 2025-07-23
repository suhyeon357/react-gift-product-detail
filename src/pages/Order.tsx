import { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import MessageCard from '../components/order/MessageCard';
import styled from '@emotion/styled';
import { orderCardTemplates } from '../data/orderCardTemplateMock';
import ReceiverModal, {
  type Receiver,
} from '../components/order/ReceiverModal';
import { useReceiverForm } from '../hooks/useReceiverForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useGiftProductById } from '../hooks/useGiftProductById';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MessaageWrapper = styled.div`
  padding: 8px 20px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 720px;
`;
const MainImg = styled.img`
  width: 360px;
  height: 240px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const MessageInput = styled.textarea`
  width: 100%;
  max-width: 720px;
  margin-top: 20px;
  padding: 12px;
  display: flex;
  flex: 1;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: 8px;
`;

const SectionBox = styled.div`
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.gray00};
  margin: 12px 20px;
  padding: 20px;
`;

const BottomOrderButton = styled.div<{ disabled: boolean }>`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.yellow300 : theme.colors.kakaoYellow};
  text-align: center;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDefault};

  cursor: pointer;
`;

const OrderInfoWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.gray00};
  padding: 20px;
  border-bottom: 8px solid ${({ theme }) => theme.colors.gray200};
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};

  margin-top: 4px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
`;

const Input = styled.input`
  width: 100%;
  flex: 1;
  padding: 12px 0px 12px 10px;
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: 8px;
  font-size: 14px;
  flex-direction: column;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.gray400};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.critical};
  font-size: 12px;
  margin-left: 1px;
  margin-top: 5px;
`;

const ProductInfo = styled.div`
  width: 100%;
  padding: 12px 0px 12px 10px;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray00};
  border: 1px solid ${({ theme }) => theme.colors.borderDisabled};
  display: flex;
  gap: 12px;
`;

const ReceiverAddButton = styled.button`
  font-size: ${({ theme }) =>
    theme.typography.subtitle2Regular.fontSize};
  font-weight: ${({ theme }) =>
    theme.typography.subtitle2Regular.fontWeight};
  line-height: ${({ theme }) =>
    theme.typography.subtitle2Regular.lineHeight};
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray300};
  border: none;
`;

const ReceiverTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-radius: 12px;
  border-spacing: 0;
  margin-top: 10px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray100};
`;

const TableRow = styled.tr``;

const TableHeader = styled.th`
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  padding: 8px;
  font-weight: bold;
  text-align: left;

  &:first-of-type {
    border-top-left-radius: 12px;
  }

  &:last-of-type {
    border-top-right-radius: 12px;
  }
`;

const TableCell = styled.td`
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  padding: 8px;

  &:first-of-type {
    border-bottom-left-radius: 12px;
  }

  &:last-of-type {
    border-bottom-right-radius: 12px;
  }
`;

const QuantityCell = styled(TableCell)`
  text-align: center;
`;

const ReceiverSection = styled.div`
  border: 1px solid #eee;
  padding: 24px;
  margin-top: 12px;
  color: #aaa;
  text-align: center;
`;

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();

  const {
    data: product,
    loading,
    error,
  } = useGiftProductById(productId);

  const [selected, setSelected] = useState(orderCardTemplates[0].id);
  const selectedCard = orderCardTemplates.find(
    card => card.id === selected
  );

  const [message, setMessage] = useState('축하해요.');

  const { nameInput } = useReceiverForm();
  const sendorNameInput = nameInput;

  const [modalOpen, setModalOpen] = useState(false);
  const [receiverList, setReceiverList] = useState<Receiver[]>([]);

  const totalQuantity = receiverList.reduce(
    (sum, r) => sum + Number(r.quantity),
    0
  );

  const priceSum = product?.price
    ? product.price.sellingPrice * totalQuantity
    : 0;

  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo?.name) sendorNameInput.setValue(userInfo.name);
  });

  const BASE_URL = 'http://localhost:3000';

  const handleOrder = async () => {
    const orderData = {
      productId: productId,
      message,
      messageCardId: String(selectedCard?.id),
      ordererName: sendorNameInput.value,
      receivers: receiverList.map(r => ({
        name: r.name,
        phoneNumber: r.phoneNumber,
        quantity: Number(r.quantity),
      })),
    };

    const authToken = userInfo?.authToken;
    if (!authToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/order`, orderData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      alert(
        `주문이 완료되었습니다.\n 상품명: ${product?.name}\n 구매 수량: ${totalQuantity}\n 발신자 이름: ${sendorNameInput.value}\n 메시지: ${message}\n`
      );
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        alert('주문에 실패했습니다.');
        console.error(err.message);
      }
    }
  };

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        상품 정보를 불러오는 중입니다...
      </div>
    );

  if (error || !product)
    return (
      <div style={{ padding: 20 }}>
        상품 정보를 불러오지 못했습니다.
      </div>
    );

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        상품 정보를 불러오는 중입니다...
      </div>
    );

  if (error || !product)
    return (
      <div style={{ padding: 20 }}>
        상품 정보를 불러오지 못했습니다.
      </div>
    );

  return (
    <>
      <Header />
      <MessaageWrapper>
        <SectionBox>
          <MessageCard
            selected={selected}
            onCardSelect={setSelected}
          />
          <MainWrapper>
            <MainImg src={selectedCard?.imageUrl} />

            <MessageInput
              placeholder="메시지를 입력해주세요."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </MainWrapper>
        </SectionBox>
      </MessaageWrapper>

      <OrderInfoWrapper>
        <Section>
          <Label>보내는 사람</Label>
          <Input
            type="text"
            placeholder="이름을 입력하세요."
            onChange={e => sendorNameInput.setValue(e.target.value)}
            onBlur={sendorNameInput.handleBlur}
            defaultValue={sendorNameInput.value}
          />
          {!sendorNameInput.isValid && (
            <ErrorText>{sendorNameInput.error}</ErrorText>
          )}
          <Description>
            * 실제 선물 발송 시 발신자이름으로 반영되는 정보입니다.
          </Description>
        </Section>

        <Section>
          <Row>
            <Label>받는 사람</Label>
            <ReceiverAddButton onClick={() => setModalOpen(true)}>
              추가
            </ReceiverAddButton>
          </Row>
          {receiverList.length === 0 ? (
            <ReceiverSection>
              받는 사람이 없습니다. <br />
              받는 사람을 추가해주세요.
            </ReceiverSection>
          ) : (
            <ul>
              <ReceiverTable>
                <TableHead>
                  <TableRow>
                    <TableHeader>이름</TableHeader>
                    <TableHeader>전화번호</TableHeader>
                    <TableHeader>수량</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {receiverList.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.phoneNumber}</TableCell>
                      <QuantityCell>{r.quantity}</QuantityCell>
                    </TableRow>
                  ))}
                </tbody>
              </ReceiverTable>
            </ul>
          )}

          <ReceiverModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onComplete={data => setReceiverList(data)}
          />
          <Label>상품 정보</Label>
          <ProductInfo>
            <img
              src={product.imageURL}
              alt={product.name}
              width={80}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{product.name}</div>
              <div style={{ color: '#888' }}>
                {product.brandInfo.name}
              </div>
              <div>
                상품가{' '}
                <strong>
                  {product?.price !== undefined
                    ? product.price.toLocaleString()
                    : '0'}
                  원
                </strong>
              </div>
            </div>
          </ProductInfo>
        </Section>
      </OrderInfoWrapper>
      <BottomOrderButton
        disabled={!sendorNameInput.isValid}
        onClick={handleOrder}
      >
        {(priceSum ?? 0).toLocaleString()}원 주문하기
      </BottomOrderButton>
    </>
  );
};

export default Order;
