const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let linkedinjobs = [];

async function scrapelinkedinJob() {
    for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
        let keywords = 'machine%20learning';
        let location = 'Lebanon';
        let url = `https://it.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${keywords}&location=${location}&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=${pageNumber}`;  
        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            $('li').each((index, element) => {
                const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
                const company = $(element).find('h4.base-search-card__subtitle').text().trim();
                const location = $(element).find('span.job-search-card__location').text().trim();
                const link = $(element).find('a.base-card__full-link').attr('href');
                const postDate = $(element).find('time').attr('datetime'); 
                const skills = []; 


                linkedinjobs.push({

                'Company Name': company,
                'Job Title': jobTitle,
                'Job Location': location,
                'Job Post Date': postDate,
                'Skills Needed': skills,
                'Application Link': link,

                //

                });
            });

        } catch (error) {
            console.error(`Error`, error);
        }
    }

    fs.writeFileSync('linkedinJobs.json', JSON.stringify(linkedinjobs, null, 2));
    console.log(`json file created and job for linkedin`);
}

scrapelinkedinJob();
