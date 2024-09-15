const investment = 15000;
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

console.log(calc_profit_from({}, 0.05));

function calc_profit_from_revenue(revenue) {
    const platform_fee_percent = 0.15;
    const software_cost = 250;
    const platform_fees = revenue * platform_fee_percent;
    const gross_profit = revenue - platform_fees - investment;
    const operating_expenses = (Math.max(Math.floor(revenue / 30000), 1)) * 400 + software_cost;
    const profit_split = gross_profit * 0.3;
    const net_profit = gross_profit - operating_expenses - profit_split;
    const net_profit_percent = net_profit / revenue;

    return {
        "Revenue": USDollar.format(revenue),
        "Inventory Cost": USDollar.format(investment),
        "Platform Fees": USDollar.format(platform_fees),
        "Gross Profit": USDollar.format(gross_profit),
        "Operating Expenses": USDollar.format(operating_expenses),
        "Profit Split": USDollar.format(profit_split),
        "Net Profit": USDollar.format(net_profit),
        "Net Profit %": `${(net_profit_percent * 100).toFixed(2)}%`,
        "Next Inventory Purchase": USDollar.format(Math.max(net_profit + investment, 0))
    };
}

function calc_profit_from(prev_results, desired_profit_percent) {
    let low = investment;  // Minimum possible revenue
    let high = investment * 100;  // A reasonably high upper bound
    const epsilon = 0.0001;  // Desired precision

    while (high - low > epsilon) {
        let mid = (low + high) / 2;
        let result = calc_profit_from_revenue(mid);
        let current_profit_percent = parseFloat(result["Net Profit %"]) / 100;

        if (Math.abs(current_profit_percent - desired_profit_percent) < epsilon) {
            return result;  // We've found a sufficiently accurate result
        } else if (current_profit_percent < desired_profit_percent) {
            low = mid;  // The correct revenue is higher
        } else {
            high = mid;  // The correct revenue is lower
        }
    }

    // If we exit the loop, we return the result for the midpoint
    return calc_profit_from_revenue((low + high) / 2);
}