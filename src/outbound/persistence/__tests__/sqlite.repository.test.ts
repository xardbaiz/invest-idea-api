import { SqlLiteIdeaRepository } from "../sqlite.repository.js";
import { InvestmentIdea } from "../../../domain/models.js";
import fs from "fs";

describe("SqlLiteIdeaRepository Unit Tests", () => {
    let repo: SqlLiteIdeaRepository;

    beforeEach(() => {
        if (fs.existsSync("invest_ideas.db")) {
            fs.unlinkSync("invest_ideas.db");
        }
        repo = new SqlLiteIdeaRepository();
    });

    afterEach(() => {
        if (fs.existsSync("invest_ideas.db")) {
            fs.unlinkSync("invest_ideas.db");
        }
    });

    it("should upsert and find idea with summary", async () => {
        const idea: InvestmentIdea = {
            id: "tradernet_1",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple Inc.",
            title: "Apple Investment Idea",
            description: "Detailed description",
            summary: "Sector: Tech\nBusiness: Electronics\nIdea: Growth",
            targetPrice: 200,
            currency: "USD",
            publishDate: "2023-01-01",
        };

        await repo.upsert(idea);

        const found = await repo.findById("tradernet_1");
        expect(found).toBeDefined();
        expect(found?.summary).toBe("Sector: Tech\nBusiness: Electronics\nIdea: Growth");

        const foundMany = await repo.findByIds(["tradernet_1"]);
        expect(foundMany.length).toBe(1);
        expect(foundMany[0].summary).toBe("Sector: Tech\nBusiness: Electronics\nIdea: Growth");
    });
});
