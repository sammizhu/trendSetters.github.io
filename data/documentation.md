1. fashion_data.csv:
    - source: Google Trends
    - name: text field indicating the name or category of an item (e.g., Sneakers, Jeans, T-shirts). It serves as a unique identifier or descriptor for the items being referenced.
    - value: numerical field representing the percentage growth of the items "popularity overtime" on Google Trend metrics.
2. fashion_market.csv:
    - source: https://www.statista.com/statistics/551775/size-of-the-global-apparel-and-footwear-market/
    - year: numerical field representing the calendar year for the recorded data and trends 
    - marketSize: numerical field indicating the total economic value of the fashion industry in the corresponding year
    - fastestSector: text field highlighting the fashion sector that experienced the most significant growth in the corresponding year
    - trends: text field describing key trends and dynamics that influenced the fashion industry for the respective year
3. market_size.csv: 
   - https://www.uniformmarket.com/statistics/global-apparel-industry-statistics
   - country: text field representing the name of the country
   - marketSize: numerical field indicating the total economic value of the fashion industry in the corresponding year
4. revenue_data.csv:
   - source: Capital IQ, accessed through Harvard’s library resources
   - Pricing Date: text field with quarter and year of reported revenue in format "FQ_ 20__", (later parsed to become a date)
   - Date: text field with quarter and year of reported revenue in format "20__ Q_", (later parsed to become a date)
   - MC-Total Revenue (FQ)($): numerical field with full digit of revenue generated from Louis Vuitton in a given quarter
   - TJX-Total Revenue (FQ)($): numerical field with full digit of revenue generated from TJ Maxx in a given quarter
   - LULU-Total Revenue (FQ)($): numerical field with full digit of revenue generated from Lululemon in a given quarter
   - GAP-Total Revenue (FQ)($): numerical field full digit of revenue generated from Gap in a given quarter
