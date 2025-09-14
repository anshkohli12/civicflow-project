package com.civicflow.civicflow_backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test/protected")
    public String protectedRoute() {
        return "You have access to the protected route!";
    }
}
