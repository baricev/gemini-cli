import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function callOpenAI(prompt: string, apiKey: string, baseUrl = 'https://api.openai.com/v1', model = 'gpt-3.5-turbo') {
  const body = {
    model,
    messages: [{ role: 'user', content: prompt }]
  };
  const res = await fetch(`${baseUrl}/chat/completions`, {
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

async function callDeepseek(prompt: string, apiKey: string, baseUrl = 'https://api.deepseek.com/v1', model = 'deepseek-reasoner') {
  const body = {
    model,
    messages: [{ role: 'user', content: prompt }]
  };
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Deepseek API error: ${res.status} ${await res.text()}`);
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
  const argv = await yargs(hideBin(process.argv))
    .usage('$0 <prompt>')
    .option('provider', {
      alias: 'p',
      choices: ['openai', 'deepseek'] as const,
      default: 'openai',
      describe: 'LLM provider'
    })
    .option('model', {
      alias: 'm',
      type: 'string',
      describe: 'Model name'
    })
    .demandCommand(1)
    .parse();

  const prompt = argv._.join(' ');
  const provider = argv.provider as 'openai' | 'deepseek';
  const model = argv.model as string | undefined;

  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('Please set DEEPSEEK_API_KEY');
      process.exit(1);
    }
    const baseUrl = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1';
    try {
      await callDeepseek(prompt, apiKey, baseUrl, model ?? 'deepseek-reasoner');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  } else {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Please set OPENAI_API_KEY');
      process.exit(1);
    }
    const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
    try {
      await callOpenAI(prompt, apiKey, baseUrl, model ?? 'gpt-3.5-turbo');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

main();
