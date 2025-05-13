import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Main Pages
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyBids from '../pages/MyBids';
import Passbook from '../pages/Passbook';
import Support from '../pages/Support';
import Funds from '../pages/Funds';
import Deposit from '../pages/Deposit';
import SelectPaymentMethod from '../pages/SelectPaymentMethod';
import PaymentConfirmation from '../pages/PaymentConfirmation';
import Withdraw from '../pages/Withdraw';
import BankDetails from '../pages/BankDetails';
import DepositHistory from '../pages/DepositHistory';
import WithdrawHistory from '../pages/WithdrawHistory';
import GameOptions from '../pages/GameOptions';
import JackpotChart from '../pages/JackpotChart';
import StarlineChart from '../pages/StarlineChart';
import Jackpot from '../pages/Jackpot';
import Starline from '../pages/Starline';

// Game Options Pages
import SingleDigits from '../pages/SingleDigits';
import SingleBulkDigits from '../pages/SingleBulkDigits';
import Jodi from '../pages/Jodi';
import JodiBulk from '../pages/JodiBulk';
import SinglePana from '../pages/SinglePana';
import SinglePanaBulk from '../pages/SinglePanaBulk';
import DoublePana from '../pages/DoublePana';
import DoublePanaBulk from '../pages/DoublePanaBulk';
import TriplePana from '../pages/TriplePana';
import PanelGroup from '../pages/PanelGroup';
import SpDpTp from '../pages/SpDpTp';
import ChoicePanaSpDp from '../pages/ChoicePanaSpDp';
import SpMotor from '../pages/SpMotor';
import DpMotor from '../pages/DpMotor';
import OddEven from '../pages/OddEven';
import TwoDigitPanel from '../pages/TwoDigitPanel';
import GroupJodi from '../pages/GroupJodi';
import DigitBasedJodi from '../pages/DigitBasedJodi';
import RedBracket from '../pages/RedBracket';
import HalfSangamOpen from '../pages/HalfSangamOpen';
import HalfSangamClose from '../pages/HalfSangamClose';
import FullSangam from '../pages/FullSangam';

// Charts Pages
import Charts from '../pages/Charts';
import Chart from '../pages/Chart';

const AppRoutes = () => {
  const protectedRoutes = [
    { path: '/home', element: <Home /> },
    { path: '/mybids', element: <MyBids /> },
    { path: '/passbook', element: <Passbook /> },
    { path: '/support', element: <Support /> },
    { path: '/funds', element: <Funds /> },
    { path: '/deposit', element: <Deposit /> },
    { path: '/selectpaymentmethod', element: <SelectPaymentMethod /> },
    { path: '/paymentconfirmation', element: <PaymentConfirmation /> },
    { path: '/withdraw', element: <Withdraw /> },
    { path: '/bankDetails', element: <BankDetails /> },
    { path: '/depositHistory', element: <DepositHistory /> },
    { path: '/withdrawHistory', element: <WithdrawHistory /> },
    { path: '/charts', element: <Charts /> }, // Main Charts Page
    { path: '/charts/:marketId', element: <Chart /> }, // Main Market Chart with ID
    { path: '/starlinechart/:gameId', element: <StarlineChart /> }, // Starline Chart with ID
    { path: '/jackpotchart/:gameId', element: <JackpotChart /> }, // Jackpot Chart with ID
    { path: '/gameOptions/:marketName', element: <GameOptions /> },
    { path: '/starline', element: <Starline /> },
    { path: '/jackpot', element: <Jackpot /> },
  ];

  const gameRoutes = [
    { path: '/singleDigits', element: <SingleDigits /> },
    { path: '/singleBulkDigits', element: <SingleBulkDigits /> },
    { path: '/jodi', element: <Jodi /> },
    { path: '/jodiBulk', element: <JodiBulk /> },
    { path: '/singlePana', element: <SinglePana /> },
    { path: '/singlePanaBulk', element: <SinglePanaBulk /> },
    { path: '/doublePana', element: <DoublePana /> },
    { path: '/doublePanaBulk', element: <DoublePanaBulk /> },
    { path: '/triplePana', element: <TriplePana /> },
    { path: '/panelGroup', element: <PanelGroup /> },
    { path: '/spDpTp', element: <SpDpTp /> },
    { path: '/choicePanaSpDp', element: <ChoicePanaSpDp /> },
    { path: '/spMotor', element: <SpMotor /> },
    { path: '/dpMotor', element: <DpMotor /> },
    { path: '/oddEven', element: <OddEven /> },
    { path: '/twoDigitPanel', element: <TwoDigitPanel /> },
    { path: '/groupJodi', element: <GroupJodi /> },
    { path: '/digitBasedJodi', element: <DigitBasedJodi /> },
    { path: '/redBracket', element: <RedBracket /> },
    { path: '/halfSangamOpen', element: <HalfSangamOpen /> },
    { path: '/halfSangamClose', element: <HalfSangamClose /> },
    { path: '/fullSangam', element: <FullSangam /> },
  ];

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {protectedRoutes.map(({ path, element }, index) => (
        <Route
          key={index}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}
      {gameRoutes.map(({ path, element }, index) => (
        <Route
          key={index}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
