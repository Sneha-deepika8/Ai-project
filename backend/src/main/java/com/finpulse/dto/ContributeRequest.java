package com.finpulse.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ContributeRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Contribution amount must be greater than zero")
    private BigDecimal amount;

    public ContributeRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}


