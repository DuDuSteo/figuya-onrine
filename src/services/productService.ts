import {
	IProductsResult,
	JsonApiDocument,
	ProductAttr,
	RelationType,
} from "@spree/storefront-api-v2-sdk";
import { queryClient } from "./client";

export interface Product extends ProductAttr {
	images: string[];
	true_id: string;
}

const InjectImage = (
	productAttr: ProductAttr,
	included: JsonApiDocument[] | undefined
): Product => {
	const images: string[] = [];

	if (Array.isArray(productAttr.relationships?.images.data)) {
		const imagesData = productAttr.relationships.images
			.data as RelationType[];
		imagesData.forEach((image: RelationType) => {
			included?.find(
				(include) =>
					include.id === image.id &&
					include.type === image.type &&
					images.push(include.attributes.original_url)
			);
		});
	}

	let trueId: string;

	if (Array.isArray(productAttr.relationships.default_variant.data))
		trueId = productAttr.relationships.default_variant.data[0].id;
	else
		trueId = productAttr.relationships.default_variant.data.id;

	return {
		...productAttr,
		images: images,
		true_id: trueId
	};
};


interface FilterObject {
	[key: string]: number | string;
}


const ProductService = {
	async getProducts(filterObject?: FilterObject): Promise<Product[]> {
		const response = queryClient.products.list({
			include: "images",
			page: 1,
			...filterObject,
		});

		const products = response.then((spreeResponse: IProductsResult) => {
			return spreeResponse
				.success()
				.data.map((productAttr: ProductAttr) => {
					return InjectImage(
						productAttr,
						spreeResponse.success().included
					);
				});
		});

		return products;
	},

	async getProduct(id: string): Promise<Product> {
		const response = await queryClient.products.show({
			id: id,
			include: "images",
		});

		const product = InjectImage(
			response.success().data,
			response.success().included
		);

		return product;
	},
};

export default ProductService;
