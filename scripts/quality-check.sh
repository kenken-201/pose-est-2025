#!/bin/bash
# =============================================================================
# quality-check.sh - 品質管理スクリプト (Bun 対応)
# =============================================================================
# 各タスク完了時に実行する品質チェックを一括で行います。
# 
# 使用方法:
#   ./scripts/quality-check.sh        # 全てのチェックを実行
#   ./scripts/quality-check.sh --fix  # lint修正を含めて実行
#
# チェック項目:
#   1. TypeScript 型チェック (bun run typecheck)
#   2. ESLint コード品質チェック (bun run lint / lint:fix)
#   3. 単体テスト + カバレッジ (bun run test:coverage)
#   4. プロダクションビルド (bun run build)
# =============================================================================

set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# スクリプトのディレクトリを取得してプロジェクトルートに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# ヘッダー表示
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           KenKen Pose Estimation - Quality Check              ║${NC}"
echo -e "${BLUE}║                      (Powered by Bun 🍞)                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Bunのバージョン確認
if command -v bun &> /dev/null; then
    echo -e "${GREEN}Using Bun $(bun --version)${NC}"
else
    echo -e "${RED}Error: Bun is not installed. Please install it: brew install oven-sh/bun/bun${NC}"
    exit 1
fi
echo ""

# 引数解析
FIX_MODE=false
if [[ "$1" == "--fix" ]]; then
    FIX_MODE=true
    echo -e "${YELLOW}📝 Fix mode enabled - lint errors will be auto-fixed${NC}"
    echo ""
fi

# 結果追跡
FAILED_CHECKS=()

# ステップ実行関数
run_step() {
    local step_name="$1"
    local command="$2"
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ ${step_name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ ${step_name} passed${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ ${step_name} failed${NC}"
        echo ""
        FAILED_CHECKS+=("$step_name")
        return 1
    fi
}

# 1. TypeScript 型チェック (CI準拠: typegen含む)
run_step "TypeScript TypeGen" "bun run typegen" || true
run_step "TypeScript Type Check" "bun run typecheck" || true

# 2. コードスタイル (Prettier & ESLint)
if $FIX_MODE; then
    run_step "Prettier Format (Write)" "bun run format" || true
    run_step "ESLint (Fix)" "bun run lint:fix" || true
else
    run_step "Prettier Format (Check)" "bun run format:check" || true
    run_step "ESLint (Check)" "bun run lint" || true
fi

# 3. 単体テスト + カバレッジ
run_step "Unit Tests with Coverage" "bun run test:coverage" || true

# 4. プロダクションビルド
run_step "Production Build" "bun run build" || true

# サマリー表示
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        Summary                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ${#FAILED_CHECKS[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All quality checks passed!${NC}"
    echo ""
    echo -e "${GREEN}Ready for commit / PR.${NC}"
    exit 0
else
    echo -e "${RED}❌ ${#FAILED_CHECKS[@]} check(s) failed:${NC}"
    for check in "${FAILED_CHECKS[@]}"; do
        echo -e "${RED}   - ${check}${NC}"
    done
    echo ""
    echo -e "${YELLOW}Please fix the issues above before committing.${NC}"
    exit 1
fi
