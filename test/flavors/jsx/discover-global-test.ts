import { SimpleTypeKind } from "ts-simple-type";
import { tsTest } from "../../helpers/ts-test";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { assertHasMembers } from "../../helpers/util";

tsTest("Discovers global features on JSX.IntrinsicAttributes", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(
		{
			fileName: "test.d.ts",
			text: `
	declare namespace JSX {
	  interface IntrinsicAttributes {
	    /**
	     * @attr
	     */
		bar?: boolean;
	  }
	}
	 `
		},
		{ config: { analyzeGlobalFeatures: true } }
	);

	const { globalFeatures } = result;

	assertHasMembers(
		globalFeatures?.members || [],
		[
			{
				kind: "property",
				propName: "bar",
				attrName: "bar",
				type: () => ({ kind: SimpleTypeKind.BOOLEAN })
			}
		],
		t,
		checker
	);
});
