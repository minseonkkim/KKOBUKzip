package com.turtlecoin.mainservice.domain.user.util;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

public class ResponseUtil {

    public static void sendResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Create JSON response
        String jsonResponse = String.format("{\"status\": %d, \"message\": \"%s\"}", statusCode, message);

        PrintWriter writer = response.getWriter();
        writer.print(jsonResponse);
        writer.flush();
    }
}