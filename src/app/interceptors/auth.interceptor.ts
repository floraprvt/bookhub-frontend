import { HttpInterceptorFn } from '@angular/common/http';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('currentUser');
  const token = storedUser ? JSON.parse(storedUser)?.token : null;
 
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }
 
  return next(req);
};