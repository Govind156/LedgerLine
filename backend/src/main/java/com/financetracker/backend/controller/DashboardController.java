package com.financetracker.backend.controller;

import com.financetracker.backend.dto.DashboardSummaryResponse;
import com.financetracker.backend.security.CurrentUserProvider;
import com.financetracker.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(dashboardService.getSummary(userId, month, year));
    }
}