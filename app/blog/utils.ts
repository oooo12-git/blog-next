import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent); // exec() 메서드는 정규식 객체의 메서드로, 문자열에서 패턴과 일치하는 첫 번째 매치를 찾습니다.
  const frontMatterBlock = match![1]; // TypeScript에서 !는 "non-null assertion operator" (널이 아님을 단언하는 연산자)입니다. TypeScript는 기본적으로 match가 null일 수 있다고 경고를 표시합니다. !를 사용함으로써 개발자가 "이 값은 확실히 null이 아니다"라고 컴파일러에게 알려주는 것입니다.
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {}; // TypeScript에서 Partial<T>는 유틸리티 타입으로, 특정 타입의 모든 프로퍼티를 선택적(optional)으로 만드는 타입입니다.

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim(); //title: "Hello: World" 이런 경우를 처리하기 위함
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value; // as keyof Metadata로 타입 단언을 하여 Metadata 타입의 키만 사용하도록 보장, Metadata 타입에 정의되지 않은 키가 있으면 TypeScript 컴파일러가 에러를 발생시킴
  });

  return { metadata: metadata as Metadata, content };
  // as Metadata는 TypeScript의 타입 단언(Type Assertion)입니다. 이 경우에는 Partial<Metadata> 타입을 Metadata 타입으로 변환하는 역할, 필수 필드에 대한 값이 없으면 런타임 에러가 발생
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}
//fs (File System)은 Node.js의 내장 모듈로, 파일 시스템과 상호작용하기 위한 기능을 제공
//readdirSync는 지정된 디렉토리의 파일 목록을 동기적으로 읽어오는 메서드, 반환값: 디렉토리 내의 모든 파일과 폴더 이름을 배열로 반환
//filter: 배열 메서드로, 조건에 맞는 요소만 선택
//path.extname(file): 파일의 확장자를 추출

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file)); //path.extname(file): 파일의 확장자를 추출
    // path.basename(file, path.extname(file)): 파일 이름에서 확장자를 제외한 부분만 추출
    // 이렇게도 쓰임 path.basename('/app/blog/posts/hello-world.mdx')  결과 : 'hello-world.mdx'

    return {
      metadata,
      slug,
      content,
    };
  }); // 배열로 반환
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "contents"));
}
// process.cwd()를 사용하여 현재 Node.js 프로세스가 실행되는 디렉토리
// 터미널에서 node app.js를 실행한 디렉토리가 현재 작업 디렉토리가 됩니다
// 프로젝트 루트 디렉토리부터 시작해서 'app/blog/posts' 경로까지의 전체 경로를 얻을 수 있습니다.

export function formatDate(date: string) {
  const targetDate = new Date(date);

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다
  const day = targetDate.getDate();

  return `${year}.${month}.${day}`;
}

export function featuredData(contentName: string): {
  metadata: Metadata;
  slug: string;
} {
  const { metadata } = readMDXFile(
    path.join(process.cwd(), "contents", `${contentName}.mdx`)
  );
  const slug = contentName;
  return { metadata, slug };
}
