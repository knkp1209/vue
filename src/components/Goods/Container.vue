<template>
	<div>
		<router-view :key="key"/>
	</div>
</template>
<script>
	export default {
		name: 'GoodsContainer',
		computed: {
			key() {
				return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
			}
		}
	}

</script>
<style>
</style>
