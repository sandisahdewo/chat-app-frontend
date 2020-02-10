<template>
	<v-row
		class="mx-3 mr-8 pr-8">
		<v-alert
			class="caption"
			dense
			color="light-blue lighten-4"
		>
			<div v-if="message.deleted_at != null">
				Deleted message
			</div>
			<div v-else>
				<div v-if="message.type == 'text'">
					{{ message.message }}
				</div>

				<div v-if="message.type == 'image'">
					<div v-if="message.send_at == null">Loading...</div>
					<v-img v-if="message.send_at != null" max-width="250" :src="`http://localhost:3000/${message.files.name}`"></v-img>
					<div>{{ message.files.caption }}</div>
				</div>
			</div>
			
			<v-row class="float-right">
				<v-col class="px-0 py-0">
					<div style="font-size:8px;">{{ new Date(message.send_at) | moment('HH:mm') }}</div>
				</v-col>
			</v-row>
		</v-alert>
	</v-row>
</template>

<script>
export default {
    name: 'CardText',
    props: ['message', 'sender']
}
</script>