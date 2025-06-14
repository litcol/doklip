from flask import Flask, render_template

# 이 부분이 가장 중요합니다. Flask 앱을 'app'이라는 이름으로 생성해야 합니다.
# Flask는 이 'app' 변수를 찾으려고 합니다.
app = Flask(__name__)

# 기본 URL 경로('/')에 접속하면 index.html 파일을 렌더링
@app.route('/')
def home():
    return render_template('index.html')

# 아래 부분은 로컬 테스트용으로, 실제 서버 실행에는 영향이 없습니다.
# 하지만 코드 완결성을 위해 그대로 두는 것이 좋습니다.
if __name__ == '__main__':
    app.run(debug=True)