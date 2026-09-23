import { SqlLiteIdeaRepository } from "../sqlite.repository.js";
import { InvestmentIdea } from "../../../domain/models.js";

describe("SqlLiteIdeaRepository Company Search", () => {
    let repo: SqlLiteIdeaRepository;

    beforeEach(() => {
        repo = new SqlLiteIdeaRepository();
    });

    it("should find unique companies and ideas by company", async () => {
        const idea1: InvestmentIdea = {
            id: "test_1",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple Inc.",
            title: "Test Idea 1",
            description: "Desc 1",
            targetPrice: 150,
            currency: "USD",
            publishDate: "2023-01-01",
        };
        const idea2: InvestmentIdea = {
            id: "test_2",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple Inc.",
            title: "Test Idea 2",
            description: "Desc 2",
            targetPrice: 160,
            currency: "USD",
            publishDate: "2023-02-01",
        };
        const idea3: InvestmentIdea = {
            id: "test_3",
            provider: "tradernet",
            ticker: "MSFT",
            companyName: "Microsoft Corp.",
            title: "Test Idea 3",
            description: "Desc 3",
            targetPrice: 300,
            currency: "USD",
            publishDate: "2023-03-01",
        };

        await repo.upsert(idea1);
        await repo.upsert(idea2);
        await repo.upsert(idea3);

        const companies = await repo.findUniqueCompanies("Apple");
        expect(companies).toEqual([{ ticker: "AAPL", companyName: "Apple Inc." }]);

        const appleIdeas = await repo.findIdeasByCompany("AAPL");
        expect(appleIdeas).toHaveLength(2);
        expect(appleIdeas[0].id).toBe("test_2");
        expect(appleIdeas[1].id).toBe("test_1");
    });
});
