const express = require('express');
const router = express.Router();

const OfferController = require('../1controllers/offer.controller');
const offerController = new OfferController();

const { authorized } = require('../middlewares/auth-middleware');

router.post('/companies/:companyId', authorized, offerController.createOffer); // 서비스 생성
// router.get('/companies/:companyId/offer', offerController.referOffer); // 기존 api

// router.put('/companies/:companyId/offer/:offerId', offerController.putOffer); 기존 api
router.put('/companies/:companyId/:offerId', authorized, offerController.putOffer); // 서비스 수정

// router.delete('/companies/:companyId/offer/:offerId', offerController.deleteOffer); 기존 api
router.delete('/companies/:offerId', authorized, offerController.deleteOffer); // 서비스 삭제

router.get('/companies', authorized, offerController.getOffer); // 전체 조회

router.get('/companies/:offerId', authorized, offerController.onlyget); // 상세 조회

module.exports = router;
