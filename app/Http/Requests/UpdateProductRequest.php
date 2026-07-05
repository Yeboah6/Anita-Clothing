<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gate this at the route/middleware level (admin auth)
    }

    public function rules(): array
    {
        $productId = $this->route('product')->id ?? $this->route('product');

        return [
            'name'              => ['required', 'string', 'max:255'],
            'category_id'       => ['required', 'exists:categories,id'],
            'price'             => ['required', 'numeric', 'min:0'],
            'discount_amount'   => ['nullable', 'numeric', 'min:0'],
            'stock_quantity'    => ['nullable', 'integer', 'min:0'],
            'sku'               => [
                'required', 'string', 'max:100',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'description'       => ['required', 'string'],
            'featured'          => ['boolean'],
            'status'            => ['required', Rule::in(['active', 'draft', 'archived'])],

            'variants'                    => ['array'],
            'variants.*.id'               => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.size'             => ['nullable', 'string', 'max:20'],
            'variants.*.color'            => ['nullable', 'string', 'max:50'],
            'variants.*.stock_quantity'   => ['nullable', 'integer', 'min:0'],

            'new_images'        => ['array'],
            'new_images.*'      => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'], // 5MB

            'deleted_image_ids'   => ['array'],
            'deleted_image_ids.*' => ['integer', 'exists:product_images,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'new_images.*.image' => 'Each uploaded file must be an image.',
            'new_images.*.max'   => 'Each image must be under 5MB.',
        ];
    }
}