import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function callOpenAI(prompt: string, apiKey: string) {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
  }
  const data: any = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (content) {
    console.log(content);
  } else {
    console.error('No response');
  }
}

export async function main() {
  const argv = await yargs(hideBin(process.argv)).usage('$0 <prompt>').demandCommand(1).argv;
  const prompt = argv._.join(' ');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Please set OPENAI_API_KEY');
    process.exit(1);
  }
  try {
    await callOpenAI(prompt, apiKey);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
