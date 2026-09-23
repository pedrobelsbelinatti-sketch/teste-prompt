const fs = require("node:fs");
const path = require("node:path");
const Handlebars = require("handlebars");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT, "prompt.hbs");
const EXAMPLES_DIR = path.join(ROOT, "examples");

const checkMode = process.argv.includes("--check");

const contexts = {
  cpf: {
    companyName: "Banco Nova Era",
    clientName: "Pedro Silva",
    firstName: "Pedro",
    isCPF: true,
  },
  cnpj: {
    companyName: "Banco Nova Era",
    clientName: "Pedro Silva",
    firstName: "Pedro",
    isCPF: false,
  },
};

function renderPrompt(template, context) {
  return `${template(context).trimEnd()}\n`;
}

function validateRenderedPrompt(rendered, context) {
  const expectedType = context.isCPF ? "CPF" : "CNPJ";

  if (!rendered.includes(`<document_type>${expectedType}</document_type>`)) {
    throw new Error(
      `O prompt renderizado não contém document_type=${expectedType}.`
    );
  }

  if (
    !rendered.includes(
      `Solicite o ${expectedType} necessário para realizar a validação.`
    )
  ) {
    throw new Error(
      `O prompt renderizado não contém a instrução esperada para ${expectedType}.`
    );
  }

  if (/{{[^}]+}}/.test(rendered)) {
    throw new Error(
      "O prompt renderizado ainda contém uma expressão Handlebars não resolvida."
    );
  }
}

function getOutputPath(name) {
  return path.join(EXAMPLES_DIR, `prompt-${name}.txt`);
}

function writeExample(name, rendered) {
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true });
  fs.writeFileSync(getOutputPath(name), rendered, "utf8");

  console.log(`✓ examples/prompt-${name}.txt gerado`);
}

function checkExample(name, rendered) {
  const outputPath = getOutputPath(name);

  if (!fs.existsSync(outputPath)) {
    console.error(
      `✗ examples/prompt-${name}.txt não existe. Execute npm run render.`
    );
    process.exitCode = 1;
    return;
  }

  const current = fs.readFileSync(outputPath, "utf8");

  if (current !== rendered) {
    console.error(
      `✗ examples/prompt-${name}.txt está desatualizado. Execute npm run render.`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`✓ examples/prompt-${name}.txt está sincronizado`);
}

function main() {
  const source = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const template = Handlebars.compile(source, { strict: true });

  for (const [name, context] of Object.entries(contexts)) {
    const rendered = renderPrompt(template, context);

    validateRenderedPrompt(rendered, context);

    if (checkMode) {
      checkExample(name, rendered);
    } else {
      writeExample(name, rendered);
    }
  }

  if (checkMode && process.exitCode !== 1) {
    console.log("✓ Todos os exemplos estão sincronizados com prompt.hbs");
  }
}

main();
