let forecast_grid;

// Report elements
const run_button                 = document.querySelector('.run-report');
const platform                   = document.querySelector('.platform');
const product_amazon             = document.querySelector('.product-amazon');
const product_walmart            = document.querySelector('.product-walmart');
const profit_split               = document.querySelector('.profit-split');
const initial_inventory_amount   = document.querySelector('.initial-inventory-amount');
const margin                     = document.querySelector('.margin');
const secondary_inventory_amount = document.querySelector('.secondary-inventory-amount');
const month_start                = document.querySelector('.month-start');
let   product                    = document.querySelector('.product.active');

run_button.addEventListener('click', run_report);
platform.addEventListener('change', platform_change);
product.addEventListener('change', product_change);
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        run_report();
    }
})

// TODO: Remove as this is for debugging purposes
// initial_inventory_amount.value = 15000;
// run_report();

function platform_change() {
    const selected_platform = platform.value;

    if(selected_platform === 'Amazon') {
        product_amazon.classList.add('active');
        product_walmart.classList.remove('active');
    } else {
        product_amazon.classList.remove('active');
        product_walmart.classList.add('active');
    }

    product.removeEventListener('change', product_change);
    product = document.querySelector('.product.active');
    product.addEventListener('change', product_change);
    product.dispatchEvent(new Event('change'));
}

function product_change() {
    const selected_platform = platform.value;
    const selected_product = product.value;

    if(selected_platform == "Amazon" && selected_product == "45000") {
        profit_split.innerHTML = "70/25";
    } else if(selected_platform == "Amazon") {
        profit_split.innerHTML = "70/30";
    }

    if(selected_platform == "Walmart" && selected_product == "35000") {
        profit_split.innerHTML = "70/25";
    } else if(selected_platform == "Walmart") {
        profit_split.innerHTML = "70/30";
    }
}

function run_report() {
    const report_result_el = document.querySelector('.report-results');
    const inventory_amount = Number(initial_inventory_amount.value);

    if(inventory_amount <= 0) {
        initial_inventory_amount.classList.add('has-error');
        initial_inventory_amount.focus();
        alert('Initial inventory amount is required before you can calculate the report.');
        return;
    } else {
        initial_inventory_amount.classList.remove('has-error');
    }

    report_result_el.classList.add('active');

    calcSummaryTable();
    calcForecastTable();
}

function calcForecastTable() {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // Forecast table values
    const revenue              = ["Revenue"];
    const platform_seller_fees = ["Platform Seller Fees"];
    const cogs                 = ["COGS"];
    const gross_profit         = ["Gross Profit (GP)"];
    const gp_margin            = ["GP Margin"];
    const profit_split         = ["Profit Split"];
    const software             = ["Software"];
    const dedicated_staff      = ["Dedicated Staff"];
    const net_profit           = ["Net Profit"];
    const net_profit_percent   = ["Net Profit %"];
    const cumulative           = ["Cumulative"];

    for(let i = 0; i < 24; i++) {
        const month = i + 1;

        if(month != 1) {
            revenue.push(revenue[month - 1] / .6);
        } else {
            revenue.push(initial_inventory_amount.value / .6);
        }
    }

    // Format to Dollars
    for(let i = 1; i <= 24; i++) {
        revenue[i] = USDollar.format(revenue[i]);
    }

    if(forecast_grid) {
        forecast_grid.destroy();
    }

    forecast_grid = new gridjs.Grid({
        columns: [{name: "Variables", width: "200px"}, "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12", "Month 13", "Month 14", "Month 15", "Month 16", "Month 17", "Month 18", "Month 19", "Month 20", "Month 21", "Month 22", "Month 23", "Month 24"],
        data: [
            revenue,
            platform_seller_fees,
            cogs,
            gross_profit,
            gp_margin,
            profit_split,
            software,
            dedicated_staff,
            net_profit,
            net_profit_percent,
            cumulative
        ],
        style: {
            padding: "0px",
            tbody: {
                "background-color": "#14161a",
            },
            th: {
                "background-color": "rgb(31, 34, 41)",
                color: "#fff",
                border: "1px solid #14161a",
            },
            td: {
                "background-color": "rgb(51, 55, 64)",
                color: "#fff",
                border: "1px solid #14161a",
            },
        }
    }).render(document.getElementById('forecast-table'));
}

function getProfitSplit() {
    const selected_platform = platform.value;
    const selected_product = product.value;

    if(selected_platform == "Amazon" && selected_product == "45000") {
        return .25;
    } else if (selected_platform == "Amazon") {
        return .30;
    }

    if(selected_platform == "Walmart" && selected_product == "35000") {
        return .25;
    } else if (selected_platform == "Walmart") {
        return .30;
    }
}

function calcSummaryTable() {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const platform_fee_percent = platform.value === 'Amazon' ? .15 : .15;
    const software_cost        = platform.value === 'Amazon' ? 250 : 130;
    const revenue              = Number(initial_inventory_amount.value / .6);
    const platform_fees        = Number(revenue * platform_fee_percent);
    const operating_expenses   = Number((Math.max(Math.floor(revenue / 30000), 1)) * 400 + software_cost);
    const gross_profit         = Number(revenue - platform_fees - initial_inventory_amount.value)
    const profit_split         = Number(gross_profit * getProfitSplit());
    const net_profit           = Number(gross_profit - operating_expenses - profit_split);


    const data = {
        sales                : USDollar.format(revenue),
        inventory_costs      : USDollar.format(initial_inventory_amount.value),
        platform_fees        : USDollar.format(platform_fees),
        operating_expenses   : USDollar.format(operating_expenses),
        gross_profit         : USDollar.format(gross_profit),
        profit_split         : USDollar.format(profit_split),
        net_profit           : USDollar.format(net_profit),
        next_inventory_order : USDollar.format(net_profit + Number(initial_inventory_amount.value))
    };

    const summary_values = document.querySelectorAll('.summary-values');
    summary_values.forEach((el) => {
        const field = el.getAttribute('data-field');
        el.innerHTML = data[field];
    });
}