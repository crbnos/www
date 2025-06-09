export default function License() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-4xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">License</h1>
          <h2 className="font-medium text-xl text-muted-foreground max-w-5xl text-balance leading-relaxed tracking-tight">
            Effective September 7, 2024
          </h2>
        </div>
      </div>
      <div className="mx-auto flex flex-col px-4 w-full lg:w-form-lg mb-28">
        <div className="prose dark:prose-invert lg:prose-lg">
          <p>Copyright © 2024 Carbon Manufacturing Systems Corporation</p>

          <p>
            Permission is hereby granted to any person purchasing or receiving a
            copy of Carbon, its source code and associated documentation files
            (the “Software”), to install, use and modify the Software as
            provided. This does not include the rights to publish, distribute,
            sublicense, and/or sell copies of the Software, source code or
            products derived from it.
          </p>

          <p>
            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>

          <p>
            The user of the software represents and warrants that they will at
            all times comply with applicable law in their download and use of
            the Software.
          </p>
        </div>
      </div>
    </div>
  );
}
