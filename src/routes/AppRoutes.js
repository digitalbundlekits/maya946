import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Main Pages
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyBids from '../pages/MyBids';
import Passbook from '../pages/Passbook';
import BidHistory from '../pages/BidHistory';
import SartBidHistory from '../pages/SartBidHistory';
import JackBidHistory from '../pages/JackBidHistory';
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
import GameOptionsstar from '../pages/GameOptionsstar';
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
import HalfSangamOpenb from '../pages/HalfSangamOpenb';
import HalfSangamClose from '../pages/HalfSangamClose';
import FullSangam from '../pages/FullSangam';

import SingleDigitsStar from '../pages/SingleDigitsStar';
import SingleBulkDigitsStar from '../pages/SingleBulkDigitsStar';
import JodiStar from '../pages/JodiStar';
import JodiBulkStar from '../pages/JodiBulkStar';
import SinglePanaStar from '../pages/SinglePanaStar';
import SinglePanaBulkStar from '../pages/SinglePanaBulkStar';
import DoublePanaStar from '../pages/DoublePanaStar';
import DoublePanaBulkStar from '../pages/DoublePanaBulkStar';
import TriplePanaStar from '../pages/TriplePanaStar';
import PanelGroupStar from '../pages/PanelGroupStar';
import SpDpTpStar from '../pages/SpDpTpStar';
import ChoicePanaSpDpStar from '../pages/ChoicePanaSpDpStar';
import SpMotorStar from '../pages/SpMotorStar';
import DpMotorStar from '../pages/DpMotorStar';
import OddEvenStar from '../pages/OddEvenStar';
import TwoDigitPanelStar from '../pages/TwoDigitPanelStar';
import GroupJodiStar from '../pages/GroupJodiStar';
import DigitBasedJodiStar from '../pages/DigitBasedJodiStar';
import RedBracketStar from '../pages/RedBracketStar';
import HalfSangamOpenStar from '../pages/HalfSangamOpenStar';
import HalfSangamOpenbStar from '../pages/HalfSangamOpenbStar';
import HalfSangamCloseStar from '../pages/HalfSangamCloseStar';
import FullSangamStar from '../pages/FullSangamStar';

// Charts Pages
import Charts from '../pages/Charts';
import Chart from '../pages/Chart';
import JackpotChart from '../pages/JackpotChart';
import StarlineChart from '../pages/StarlineChart';

const AppRoutes = () => {
  // Define all protected routes dynamically
  const protectedRoutes = [
    { path: '/home', element: <Home /> },
    { path: '/mybids', element: <MyBids /> },
    { path: '/passbook', element: <Passbook /> },
    { path: '/BidHistory', element: <BidHistory /> },
    { path: '/SartBidHistory', element: <SartBidHistory /> },
    { path: '/JackBidHistory', element: <JackBidHistory /> },
    { path: '/support', element: <Support /> },
    { path: '/funds', element: <Funds /> },
    { path: '/deposit', element: <Deposit /> },
    { path: '/selectpaymentmethod', element: <SelectPaymentMethod /> },
    { path: '/paymentconfirmation', element: <PaymentConfirmation /> },
    { path: '/withdraw', element: <Withdraw /> },
    { path: '/bankDetails', element: <BankDetails /> },
    { path: '/depositHistory', element: <DepositHistory /> },
    { path: '/withdrawHistory', element: <WithdrawHistory /> },
    { path: '/starline', element: <Starline /> },
    { path: '/jackpot', element: <Jackpot /> },
    { path: '/charts', element: <Charts /> }, // Main Charts Page
    { path: '/charts/:marketId', element: <Chart /> }, // Main Market Chart with ID
    { path: '/starlinechart/:gameId', element: <StarlineChart /> }, // Starline Chart with ID
    { path: '/jackpotchart/:gameId', element: <JackpotChart /> }, // Jackpot Chart with ID
    { path: '/gameOptions/:marketName', element: <GameOptions /> },
    { path: '/gameOptionsstar/:marketName', element: <GameOptionsstar /> },
  ];

  // Define all game-specific routes dynamically
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
    { path: '/halfSangamOpenb', element: <HalfSangamOpenb /> },
    { path: '/halfSangamClose', element: <HalfSangamClose /> },
    { path: '/fullSangam', element: <FullSangam /> },
    { path: '/singleDigitsStar', element: <SingleDigitsStar /> },
    { path: '/singleBulkDigitsStar', element: <SingleBulkDigitsStar /> },
    { path: '/jodiStar', element: <JodiStar /> },
    { path: '/jodiBulkStar', element: <JodiBulkStar /> },
    { path: '/singlePanaStar', element: <SinglePanaStar /> },
    { path: '/singlePanaBulkStar', element: <SinglePanaBulkStar /> },
    { path: '/doublePanaStar', element: <DoublePanaStar /> },
    { path: '/doublePanaBulkStar', element: <DoublePanaBulkStar /> },
    { path: '/triplePanaStar', element: <TriplePanaStar /> },
    { path: '/panelGroupStar', element: <PanelGroupStar /> },
    { path: '/spDpTpStar', element: <SpDpTpStar /> },
    { path: '/choicePanaSpDpStar', element: <ChoicePanaSpDpStar /> },
    { path: '/spMotorStar', element: <SpMotorStar /> },
    { path: '/dpMotorStar', element: <DpMotorStar /> },
    { path: '/oddEvenStar', element: <OddEvenStar /> },
    { path: '/twoDigitPanelStar', element: <TwoDigitPanelStar /> },
    { path: '/groupJodiStar', element: <GroupJodiStar /> },
    { path: '/digitBasedJodiStar', element: <DigitBasedJodiStar /> },
    { path: '/redBracketStar', element: <RedBracketStar /> },
    { path: '/halfSangamOpenStar', element: <HalfSangamOpenStar /> },
    { path: '/halfSangamOpenbStar', element: <HalfSangamOpenbStar /> },
    { path: '/halfSangamCloseStar', element: <HalfSangamCloseStar /> },
    { path: '/fullSangamStar', element: <FullSangamStar /> },
  ];

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, element }, index) => (
        <Route
          key={index}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}

      {/* Game Option Routes */}
      {gameRoutes.map(({ path, element }, index) => (
        <Route
          key={index}
          path={`${path}/:marketName`}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
