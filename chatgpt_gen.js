const investment = 15000;
const revenue = investment / .6;
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const prev_calc = {"Revenue": USDollar.format(revenue), ...calc_profit_from_revenue(revenue)};
console.log(calc_profit_from(.05));

function calc_profit_from_revenue(revenue) {
    const platform_fee_percent = "Amazon" === 'Amazon' ? .15 : .15;
    const software_cost        = "Amazon" === 'Amazon' ? 250 : 130;
    const platform_fees        = Number(revenue * platform_fee_percent);
    const gross_profit         = Number(revenue - platform_fees - investment);
    const operating_expenses   = Number((Math.max(Math.floor(revenue / 30000), 1)) * 400 + software_cost);
    const profit_split         = Number(gross_profit * .3);
    const net_profit           = Number(gross_profit - operating_expenses - profit_split);

    return {
        "Inventory Cost"       : USDollar.format(investment),
        "Platform Fees"        : USDollar.format(platform_fees),
        "Gross Profit"         : USDollar.format(gross_profit),
        "Operating Expenses"   : USDollar.format(operating_expenses),
        "Profit Split"         : USDollar.format(profit_split),
        "Net Profit"           : USDollar.format(net_profit),
        "Net Profit %"         : `${(net_profit / revenue * 100).toFixed(2)}%`,
        "Next Inventory Purchase (if net profits were rolled into next purchase)" : USDollar.format(Math.max(net_profit + Number(investment), 0))
    };
}

function convertDollarToNumber(dollar) {
    return parseFloat(dollar.replace(/[^0-9.-]+/g,""));
}

// function calc_profit_from(prev_results, new_profit_percent) {
//     const prev_cost = convertDollarToNumber(prev_results["Profit Split"]) + convertDollarToNumber(prev_results["Operating Expenses"]);
//     const prev_revenue = convertDollarToNumber(prev_results["Revenue"]);
//     const prev_net_profit_percent = convertDollarToNumber(prev_results["Net Profit"]) / prev_revenue;
//     // const new_revenue = (Number(prev_cost) + Number(investment)) / (1 - Number(prev_net_profit_percent) - Number(new_profit_percent));
//     const new_revenue = investment / (1 - platform_fee_percent - profit_split_percent * (1 - platform_fee_percent) - desired_profit_percent);


//     return { "Revenue": USDollar.format(new_revenue), ...calc_profit_from_revenue(new_revenue) };
// }

function calc_profit_from(desired_profit_percent) {
    const investment = initial_inventory_amount.value;
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