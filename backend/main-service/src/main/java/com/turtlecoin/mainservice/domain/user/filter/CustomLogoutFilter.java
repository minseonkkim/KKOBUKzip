//package com.turtlecoin.mainservice.domain.user.filter;
//
//
//import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
//import com.turtlecoin.mainservice.domain.user.util.ResponseUtil;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletRequest;
//import jakarta.servlet.ServletResponse;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.GenericFilterBean;
//
//import java.io.IOException;
//
//public class CustomLogoutFilter extends GenericFilterBean {
//
//    private JWTUtil jwtUtil;
//    private RedisTemplate redisTemplate;
//
//    public CustomLogoutFilter(JWTUtil jwtUtil, RedisTemplate redisTemplate) {
//        this.jwtUtil = jwtUtil;
//        this.redisTemplate = redisTemplate;
//    }
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
//        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
//    }
//    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
//        //path and method verify
//        String requestUri = request.getRequestURI();
//        if (!requestUri.matches("^\\/logout$")) {
//
//            filterChain.doFilter(request, response);
//            return;
//        }
//        String requestMethod = request.getMethod();
//        if (!requestMethod.equals("POST")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//        String refresh = request.getHeader("Refresh-Token");
//        if(!jwtUtil.validateRefreshToken(refresh)){
//            ResponseUtil.sendResponse(response,HttpServletResponse.SC_BAD_REQUEST,"로그아웃 처리 중 오류가 발생했습니다.");
//            return;
//        }
//        SecurityContextHolder.clearContext();
//        redisTemplate.delete(refresh);
//        ResponseUtil.sendResponse(response,HttpServletResponse.SC_OK,"정상적으로 로그아웃 처리가 완료되었습니다.");
//    }
//}
