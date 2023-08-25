const jwt = require('jsonwebtoken');
const permissionCache = require('../cache/permissionCache');

exports.authorized = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ errorMessage: '권한이 존재하지 않습니다.' });
    }

    const [authType, authToken] = (authorization ?? '').split(' ');
    console.log('authType:', authType);
    console.log('authToken:', authToken);

    if (authType !== 'Bearer' || !authToken) {
      return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    const { userId, email } = jwt.verify(authToken, process.env.COOKIE_SECRET);
    res.locals.userId = userId;
    res.locals.email = email;
    next();
  } catch (error) {
    console.error('Authorized Error:', error);
    res.status(400).json({ errorMessage: '잘못된 접근입니다.' });
  }
};

exports.hasMinimumPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = res.locals.userId;

      if (isNaN(userId) || userId < 1) {
        return res.status(400).json({ success: false, message: '허가된 유저만 사용 가능합니다.' });
      }

      const userPermission = permissionCache.getPermissionCache(userId);

      if (!userPermission) {
        return res.status(400).json({ success: false, message: '허가된 유저만 사용 가능합니다.' });
      }

      const grade = {
        admin: 3,
        owner: 2,
        guest: 1,
      };

      if (grade[userPermission] >= grade[permission]) {
        return next();
      }

      return res.status(400).json({ message: '허가된 유저만 사용 가능합니다.' });
    } catch (error) {
      console.error('Minimum Permission Error:', error);
      res.status(400).json({ errorMessage: '잘못된 접근입니다.' });
    }
  };
};
