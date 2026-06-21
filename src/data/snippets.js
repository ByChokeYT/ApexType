export const snippets = [
  {
    language: 'javascript',
    code: 'const calculateWPM = (chars, time) => {\n  return Math.round((chars / 5) / (time / 60));\n};'
  },
  {
    language: 'javascript',
    code: 'document.addEventListener("keydown", (e) => {\n  if (e.key === "Enter") handleNextSnippet();\n});'
  },
  {
    language: 'php',
    code: 'public function getUserData(int $id): array {\n    return $this->db->query("SELECT * FROM users WHERE id = ?", [$id]);\n}'
  },
  {
    language: 'css',
    code: '.typing-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}'
  },
  {
    language: 'javascript',
    code: 'async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}'
  },
  {
    language: 'python',
    code: 'def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b'
  },
  {
    language: 'php',
    code: 'foreach ($items as $item) {\n    echo "Processing: " . $item->name . PHP_EOL;\n}'
  },
  {
    language: 'golang',
    code: 'func main() {\n    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintf(w, "Hello, TypeSripe!")\n    })\n    log.Fatal(http.ListenAndServe(":8080", nil))\n}'
  },
  {
    language: 'java',
    code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Type fast, code better!");\n    }\n}'
  },
  {
    language: 'javascript',
    code: 'const proxy = new Proxy(target, {\n  get: (obj, prop) => {\n    return prop in obj ? obj[prop] : "Not Found";\n  }\n});'
  }
];
